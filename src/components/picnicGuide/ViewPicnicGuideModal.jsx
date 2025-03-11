import { getGuideBySlug } from "@/services/guideService";
import { formatDateToHHMMDDMMYYYY } from "@/utils/format/date";
import StatusCodes from "@/utils/status/StatusCodes";
import { Avatar, Collapse, Image, Modal, Tag } from "antd";
import { useEffect, useState } from "react";

const ViewPicnicGuideModal = ({
  open = false,
  handleClose = () => {},
  guideSlug,
}) => {
  const [guide, setGuide] = useState();

  useEffect(() => {
    if (guideSlug) {
      const fetchGuide = async () => {
        const res = await getGuideBySlug(guideSlug);

        if (res && res.EC === StatusCodes.SUCCESS) {
          setGuide(res.DT);
        }

        if (res && res.EC === StatusCodes.ERRROR) {
          setGuide(null);
        }
      };

      fetchGuide();
    }
  }, [guideSlug]);

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      maskClosable={false}
      cancelText="Thoát"
      okButtonProps={{ hidden: true }}
      width={900}
      style={{ top: 20 }}
    >
      <div className="space-y-6 py-3">
        <div className="text-xl font-extrabold text-main">{guide?.title}</div>
        <div className="space-y-6">
          <div className="flex gap-8 pb-2 text-sm">
            <div className="w-1/2">
              <div>
                <Image src={guide?.image} loading="lazy" alt="" />
              </div>
            </div>
            <div className="w-1/2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-x-2">
                  <span className="font-semibold">Tác giả:</span>
                  <span>{guide?.author?.fullName}</span>
                </div>
                <Avatar src={guide?.author?.avatar} size={32} />
              </div>
              <div className="space-x-2">
                <span className="font-semibold">Ngày tạo:</span>
                <span>{formatDateToHHMMDDMMYYYY(guide?.createdAt)}</span>
              </div>
              <div className="space-x-2">
                <span className="font-semibold">Ngày cập nhật lần cuối:</span>
                <span>
                  {guide?.updatedAt ? (
                    formatDateToHHMMDDMMYYYY(guide?.updatedAt)
                  ) : (
                    <Tag color="blue">Chưa cập nhật</Tag>
                  )}
                </span>
              </div>
              <div className="space-x-2">
                <span className="font-semibold">Trạng thái:</span>
                <span>
                  {
                    <Tag color={guide?.isPublished ? "green" : "yellow"}>
                      {guide?.isPublished ? "Đã đăng" : "Đã gỡ"}
                    </Tag>
                  }
                </span>
              </div>
              <div className="space-x-2">
                <span className="font-semibold">Ngày đăng tải lần cuối:</span>
                <span>
                  {guide?.publishedAt ? (
                    formatDateToHHMMDDMMYYYY(guide?.publishedAt)
                  ) : (
                    <Tag color="red">Chưa đăng tải</Tag>
                  )}
                </span>
              </div>
              <div className="space-x-2">
                <span className="font-semibold">Slug:</span>
                <span>{guide?.slug}</span>
              </div>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <div className="font-semibold">Tóm tắt:</div>
            <div>{guide?.summary}</div>
          </div>
          <div>
            <Collapse
              items={[
                {
                  key: "content",
                  label: "Nội dung",
                  children: (
                    <div
                      dangerouslySetInnerHTML={{ __html: guide?.content }}
                    ></div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewPicnicGuideModal;
