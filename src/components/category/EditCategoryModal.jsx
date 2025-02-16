import { editCategory, getCategoryByID } from "@/services/categoryService";
import StatusCodes from "@/utils/status/StatusCodes";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CategoryForm from "./CategoryForm";

const FORM_NAME = "edit-category-form";

const EditCategoryModal = ({
  open = false,
  handleClose = () => {},
  categoryID = null,
  refetch = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (categoryID) {
      const fetchCategory = async () => {
        const res = await getCategoryByID(categoryID);

        if (res && res.EC === StatusCodes.SUCCESS) {
          setCategory({ ...res.DT, image: res.DT?.image?.path });
        }

        if (res && res.EC === StatusCodes.ERRROR) {
          toast.error(res.EM);
        }
      };

      fetchCategory();
    }
  }, [categoryID]);

  const handleSave = async (data) => {
    if (data && categoryID) {
      setLoading(true);
      const res = await editCategory(categoryID, data);
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
      title={`Chỉnh sửa danh mục${category ? ` ${category?.name}` : ""}`}
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
      <CategoryForm
        name={FORM_NAME}
        edit={{ editable: true, initialValue: category }}
        handleSave={handleSave}
      />
    </Modal>
  );
};

export default EditCategoryModal;
