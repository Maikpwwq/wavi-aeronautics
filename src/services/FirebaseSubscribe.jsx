import React, { useState } from "react";
import PropTypes from "prop-types";
import { firestore } from "@/firebase/firebaseClient";
import { collection, doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

function FirebaseSubscribe(props) {
  const _firestore = firestore;
  const { suscribeMail } = props;
  const suscribeRef = collection(_firestore, "suscritos");

  const userSuscribe = async (updateInfo, userID) => {
    await setDoc(doc(suscribeRef, userID), updateInfo, { merge: true });
  };

  const handleSubscribe = () => {
    const suscriptionId = uuidv4();
    userSuscribe(suscribeMail, suscriptionId);
  };

  handleSubscribe();
  return true;
}

FirebaseSubscribe.propTypes = {
  suscribeMail: PropTypes.string.isRequired,
};

export default FirebaseSubscribe;
