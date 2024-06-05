import styles from './Modal.module.css'

const Modal = ({children, isOpen, closeModal}) => {
    if(!isOpen) {
        return null
    }
  return (
    <div className={styles.modalBackdrop} onClick={closeModal}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {children}
            <button onClick={closeModal} style={{marginTop:"30px"}}>닫기</button>
        </div>
    </div>
  )
}

export default Modal