import JoditEditor from "jodit-react";

const Editor = ({
  content,
  setContent = (value) => {},
  minHeight = "300px",
}) => {
  const config = {
    placeholder: "Nhập nội dung",
    autofocus: true,
    uploader: {
      insertImageAsBase64URI: true,
    },
    minHeight,
    style: {
      padding: "16px",
    },
  };

  return (
    <JoditEditor
      config={config}
      value={content}
      onBlur={(newValue) => setContent(newValue)}
    />
  );
};

export default Editor;
