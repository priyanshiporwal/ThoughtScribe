import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function CustomModal({showModal,hideModal,isTrue}) {
  const [show, setShow] = useState(showModal)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* <Button variant={variant} onClick={handleShow}>
        {title}
      </Button> */}
      

      <Modal
        show={showModal}
        onHide={hideModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header >
          <Modal.Title>Are you sure you want to delete this post?</Modal.Title>
        </Modal.Header>
        {/* <Modal.Body>
          I will not close if you click outside me. Don not even try to press
          escape key.
        </Modal.Body> */}
        <Modal.Footer>
          <Button variant="secondary" onClick={hideModal}>
            No
          </Button>
          <Button variant="danger">Yes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CustomModal;