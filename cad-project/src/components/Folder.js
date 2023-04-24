import React, { useEffect, useState } from "react";
import { FiFilePlus } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { FiArrowLeftCircle } from "react-icons/fi";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Nav } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import pageBG from "../assets/app-bg.jpg";
import { AiFillDelete } from "react-icons/ai";
import { deleteDoc, deleteField } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";
export default function Folder({ database }) {
  const storage = getStorage();
  let params = useParams();
  let navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [progress, setProgress] = useState(null);
  const [folderName, setFolderName] = useState("");
  const databaseRef = doc(database, "driveData", params?.id);
  const getFile = (event) => {
    const fileRef = ref(storage, event.target.files[0].name);
    const uploadTask = uploadBytesResumable(fileRef, event.target.files[0]);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(progress));

        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            console.log("uplaod default case");
        }
      },
      (error) => {
        console.log(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updateDoc(databaseRef, {
            fileLink: [
              ...folders,
              {
                downloadURL: downloadURL,
                fileName: event.target.files[0].name,
              },
            ],
          });
        });
      }
    );
  };

  const readData = () => {
    onSnapshot(databaseRef, (doc) => {
      setFolders(doc.data().fileLink);
      setFolderName(doc.data().folderName);
    });
  };

  const openFile = (downloadURL) => {
    window.open(downloadURL, "_blank");
  };

  const deleteFile = async (downloadURL) => {
    await updateDoc(databaseRef, {
      downloadURL: deleteField(),
    });
  };

  const goBack = () => {
    navigate("/drive");
  };

  useEffect(() => {
    readData();
  }, []);

  return (
    <div className="bg" style={{ backgroundImage: `url(${pageBG})` }}>
      <Navbar bg="dark" expand="lg" variant="dark">
        <Container>
          <Button variant="outline-success" onClick={goBack}>
            Back
          </Button>
          <Nav className="me-auto">
            <Nav.Link>{folderName}</Nav.Link>
          </Nav>
          <Nav.Item class="upload-btn-wrapper">
            <Button className="menu-btn" variant="outline-light">
              Upload File
            </Button>
            <input type="file" name="myfile" onChange={getFile} />
          </Nav.Item>
        </Container>
      </Navbar>

      <div className="progress-bar-container">
        {progress || progress === 100 ? (
          <ProgressBar completed={progress} />
        ) : (
          <></>
        )}
      </div>

      <div className="grid-parent">
        {folders?.map((folder) => {
          return (
            <>
              {folder.downloadURL !== "" ? (
                <div
                  className="preview-child"
                  onClick={() => openFile(folder.downloadURL)}
                >
                  <img
                    className="image-preview"
                    src={folder.downloadURL}
                    alt="image"
                  />
                  <h5>{folder.fileName}</h5>
                </div>
              ) : (
                " "
              )}
            </>
          );
        })}
      </div>

      <div>
        <hr
          className="bg-hr"
          style={{
            background: "lime",
            color: "lime",
            borderColor: "lime",
            height: "3px",
          }}
        />
      </div>
    </div>
  );
}
