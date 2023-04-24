import React, { useState, useEffect } from "react";
import { Modal, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import pageBG from "../assets/app-bg.jpg";
import ProgressBar from "./ProgressBar";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "../assets/firebase-logo.svg.svg";
import Button from "react-bootstrap/Button";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { AiFillDelete } from "react-icons/ai";
import { Nav } from "react-bootstrap";

export default function Drive({ database }) {
  let auth = getAuth();
  const [progress, setProgress] = useState(null);
  const storage = getStorage();
  let navigate = useNavigate();
  const collectionRef = collection(database, "driveData");
  const [folderName, setFolderName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const folderUpload = () => {
    addDoc(collectionRef, {
      folderName: folderName,
      fileLink: [
        {
          downloadURL: "",
          fileName: "",
        },
      ],
    })
      .then(() => {
        setIsModalOpen(false);
        // alert('Folder Added')
        setFolderName("");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

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
          setProgress(null);
          addDoc(collectionRef, {
            fileName: event.target.files[0].name,
            downloadURL: downloadURL,
          });
        });
      }
    );
  };

  const deleteData = async (id) => {
    await deleteDoc(doc(database, "driveData", id));
  };

  const deleteFile = async (id) => {
    await deleteDoc(doc(database, "driveData", id));
  };

  const readData = () => {
    onSnapshot(collectionRef, (data) => {
      setFolders(
        data.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
      );
    });
  };

  const openFile = (downloadURL) => {
    window.open(downloadURL, "_blank");
  };

  const openFolder = (id) => {
    navigate("/folder/" + id);
  };

  const logOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const authState = () => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);

      if (user) {
        navigate("/drive");
      } else {
        navigate("/");
      }
    });
  };

  useEffect(() => {
    readData();
    authState();
  }, []);

  return (
    <div className="bg" style={{ backgroundImage: `url(${pageBG})` }}>
      <Navbar bg="dark" expand="lg" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            FIREDRIVE
          </Navbar.Brand>

          <Button variant="outline-success" onClick={logOut}>
            Log Out
          </Button>
        </Container>
      </Navbar>
      <Nav
        bg="dark"
        className="justify-content-center"
        defaultActiveKey="/home"
      >
        <Nav.Item class="upload-btn-wrapper">
          <Button className="menu-btn" variant="outline-dark">
            Upload File
          </Button>
          <input type="file" name="myfile" onChange={getFile} />
        </Nav.Item>

        <Nav.Item>
          <Button
            className="menu-btn"
            variant="outline-dark"
            onClick={showModal}
          >
            New Folder
          </Button>
        </Nav.Item>
      </Nav>

      <div className="progress-bar-container">
        {progress || progress === 100 ? (
          <ProgressBar completed={progress} />
        ) : (
          <></>
        )}
      </div>
      <div className="folder-space">
        <div className="grid-parent">
          {folders?.map((folder) => {
            return (
              <div>
                <div className="dabba">
                  <AiFillDelete
                    className="dlt-icon"
                    onClick={() =>
                      folder.folderName
                        ? deleteData(folder.id)
                        : deleteFile(folder.id)
                    }
                  />
                  <div
                    onClick={() =>
                      folder.folderName
                        ? openFolder(folder.id)
                        : openFile(folder.downloadURL)
                    }
                  >
                    <h4 className="tex">
                      {folder.folderName ? folder.folderName : folder.fileName}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Modal
        title="Add new folder"
        centered
        open={isModalOpen}
        onOk={folderUpload}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Enter the folder name"
          onChange={(event) => setFolderName(event.target.value)}
          value={folderName}
        />
      </Modal>

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
