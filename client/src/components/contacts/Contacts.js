import React, { Fragment, useContext, useEffect } from "react";
import ContactContext from "../../context/contact/contactContext";
import ContactItem from "./ContactItem";
import Spinner from "../layout/Spinner";
import { CLEAR_CONTACTS } from "../../context/types";

const Contacts = () => {
  const contactContext = useContext(ContactContext);
  const {
    contacts,
    getContacts,
    clearContacts,
    loading,
    filtered
  } = contactContext;

  useEffect(() => {
    getContacts();
    clearContacts();
  }, []);

  if (contacts !== null && contacts.length === 0) {
    return <h4>Please add one.</h4>;
  }

  return (
    <Fragment>
      {contacts !== null && !loading ? (
        filtered !== null ? (
          filtered.map(contact => (
            <ContactItem key={contact._id} contact={contact} />
          ))
        ) : (
          contacts.map(contact => (
            <ContactItem key={contact._id} contact={contact} />
          ))
        )
      ) : (
        <Spinner />
      )}
    </Fragment>
  );
};

export default Contacts;
