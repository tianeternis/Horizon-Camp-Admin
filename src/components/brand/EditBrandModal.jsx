import { editBrand, getBrand } from "@/services/brandService";
import StatusCodes from "@/utils/status/StatusCodes";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import BrandForm from "./BrandForm";
import { toast } from "react-toastify";

const FORM_NAME = "edit-brand-form";

const EditBrandModal = ({
  open = false,
  handleClose = () => {},
  brandID = null,
  refetch = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    const fetchBrand = async () => {
      const res = await getBrand(brandID);

      if (res && res.EC === StatusCodes.SUCCESS) {
        setBrand({ ...res.DT, image: res.DT?.image?.path });
      }

      if (res && res.EC === StatusCodes.ERRROR) {
        toast.error(res.EM);
      }
    };

    fetchBrand();
  }, []);

  const handleSave = async (data) => {
    if (data && brandID) {
      setLoading(true);
      const res = await editBrand(brandID, data);
      setLoading(false);

      if (res && res.EC === StatusCodes.SUCCESS) {
        toast.success(res.EM);
        handleClose();
        refetch();
      }

      if (res && res.EC === StatusCodes.ERRROR) {
        toast.error(res.EM);
      }
    }
  };

  return (
    <Modal
      title={`Chỉnh sửa thương hiệu${brand ? ` ${brand?.name}` : ""}`}
      open={open}
      onCancel={handleClose}
      maskClosable={false}
      cancelText="Thoát"
      okText="Lưu"
      okButtonProps={{
        autoFocus: true,
        htmlType: "submit",
        form: FORM_NAME,
        loading: loading,
        disabled: loading,
      }}
      cancelButtonProps={{
        loading: loading,
        disabled: loading,
      }}
    >
      <BrandForm
        name={FORM_NAME}
        edit={{ editable: true, initialValue: brand }}
        handleSave={handleSave}
      />
    </Modal>
  );
};

export default EditBrandModal;
