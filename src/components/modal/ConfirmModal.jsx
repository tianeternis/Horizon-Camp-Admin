import { Modal } from "antd";
import { HiOutlineInformationCircle } from "react-icons/hi2";

const ConfirmModal = ({
  open = false,
  handleClose = () => {},
  handleOK = () => {},
  content = <></>,
}) => {
  return (
    <Modal
      open={open}
      onCancel={handleClose}
      maskClosable={false}
      cancelButtonProps={{ hidden: true }}
      okButtonProps={{ hidden: true }}
      footer={
        <div className="flex justify-center gap-3">
          <button
            className="rounded-md border border-solid border-gray-300 bg-transparent px-4 py-1.5 outline-none hover:bg-gray-50"
            onClick={handleClose}
          >
            Không, thoát
          </button>
          <button
            className="rounded-md bg-red-600 px-4 py-1.5 text-white outline-none hover:bg-red-700"
            onClick={handleOK}
          >
            Có, tôi chắc chắn
          </button>
        </div>
      }
      centered
      width={400}
    >
      <HiOutlineInformationCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
      <h3 className="mb-5 px-4 text-center text-base font-normal text-gray-500">
        {content}
      </h3>
    </Modal>
  );
};

export default ConfirmModal;
