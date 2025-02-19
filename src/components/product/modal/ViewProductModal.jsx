import { getProductByID } from "@/services/productService";
import { formatCurrency } from "@/utils/format/currency";
import { formatDateToHHMMDDMMYYYY } from "@/utils/format/date";
import StatusCodes from "@/utils/status/StatusCodes";
import { Collapse, Image, Modal, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";

const ViewProductModal = ({
  open = false,
  handleClose = () => {},
  productID = null,
}) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (productID) {
      const fetchProduct = async () => {
        const res = await getProductByID(productID);

        if (res && res.EC === StatusCodes.SUCCESS) {
          setProduct(res.DT);
        }
      };

      fetchProduct();
    }
  }, [productID]);

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      maskClosable={false}
      cancelText="Thoát"
      okButtonProps={{ hidden: true }}
      width={1000}
      style={{ top: 20 }}
    >
      <div className="space-y-6 py-3">
        <div className="text-xl font-extrabold text-main">{product?.name}</div>
        <div className="space-y-6">
          <div className="flex gap-8 pb-2 text-sm">
            <div className="w-1/2 space-y-4">
              <div className="space-x-2">
                <span className="font-semibold">Danh mục:</span>
                <span>{product?.category?.name}</span>
              </div>
              <div className="space-x-2">
                <span className="font-semibold">Giá bán:</span>
                <span>
                  {(() => {
                    const first = product?.variants[0]?.price;
                    const last =
                      product?.variants[product?.variants?.length - 1]?.price;

                    return (
                      <span>
                        {formatCurrency(first)}
                        {first !== last ? ` - ${formatCurrency(last)}` : ""}
                      </span>
                    );
                  })()}
                </span>
              </div>
              <div
                className="flex gap-2"
                style={product?.discount ? { flexDirection: "column" } : {}}
              >
                <div className="font-semibold">Giảm giá đang áp dụng:</div>
                {product?.discount ? (
                  <ul className="ms-4 space-y-2">
                    <li>
                      <div className="space-x-2">
                        <span className="font-medium">Giá trị:</span>
                        <span>{product?.discount?.value}%</span>
                      </div>
                    </li>
                    <li>
                      <div className="space-x-2">
                        <span className="font-medium">Ngày bắt đầu:</span>
                        <span>
                          {formatDateToHHMMDDMMYYYY(
                            product?.discount?.startDate,
                          )}
                        </span>
                      </div>
                    </li>
                    <li>
                      <div className="space-x-2">
                        <span className="font-medium">Ngày kết thúc:</span>
                        <span>
                          {formatDateToHHMMDDMMYYYY(product?.discount?.endDate)}
                        </span>
                      </div>
                    </li>
                  </ul>
                ) : (
                  <Tag color="blue">Không có</Tag>
                )}
              </div>
            </div>
            <div className="w-1/2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-x-2">
                  <span className="font-semibold">Thương hiệu:</span>
                  <span>{product?.brand?.name}</span>
                </div>
                <div className="w-16">
                  <Image src={product?.brand?.image} loading="lazy" alt="" />
                </div>
              </div>
              <div className="space-x-2">
                <span className="font-semibold">Tổng số lượt bán:</span>
                <span>{product?.soldNumber}</span>
              </div>
              <div className="space-x-2">
                <span className="font-semibold">Trạng thái hiển thị:</span>
                <span>
                  {product?.visible ? (
                    <Tag color="green">Hiển thị</Tag>
                  ) : (
                    <Tag color="red">Ẩn</Tag>
                  )}
                </span>
              </div>
              <div className="space-x-2">
                <span className="font-semibold">Ngày tạo:</span>
                <span>{formatDateToHHMMDDMMYYYY(product?.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-10 gap-2">
            {product?.images &&
              product?.images?.length > 0 &&
              product?.images?.map((img, i) => (
                <div
                  key={`view-product-detail-image-${i}-${img?._id}`}
                  className="col-span-1"
                >
                  <Image
                    src={img?.image?.path}
                    loading="lazy"
                    alt=""
                    style={{
                      borderRadius: "4px",
                      border: "1px solid #d1d5db",
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              ))}
          </div>
          <div>
            <Collapse
              items={[
                {
                  key: "description",
                  label: "Mô tả sản phẩm",
                  children: (
                    <p className="text-justify">{product?.description}</p>
                  ),
                },
              ]}
            />
          </div>
          <div>
            <Collapse
              items={[
                {
                  key: "variants",
                  label: "Các biến thể của sản phẩm",
                  children: (
                    <Table
                      size="small"
                      bordered
                      columns={[
                        {
                          key: "STT",
                          dataIndex: "STT",
                          title: "STT",
                          align: "center",
                          render: (_, __, index) => index + 1,
                        },
                        {
                          key: "quantity",
                          dataIndex: "quantity",
                          title: "Số lượng còn lại",
                          align: "center",
                        },
                        {
                          key: "price",
                          dataIndex: "price",
                          title: "Giá bán",
                          align: "center",
                          render: (value) => (
                            <span>{formatCurrency(value)}</span>
                          ),
                        },
                        {
                          key: "color",
                          dataIndex: "color",
                          align: "center",
                          title: "Màu sắc",
                          render: (_, record) =>
                            record?.color && !isEmpty(record?.color) ? (
                              <div className="flex items-center justify-center gap-2">
                                <div
                                  className="rounded-full p-2.5"
                                  style={{
                                    background: record?.color?.hex,
                                    border:
                                      record?.color?.hex === "#ffffff"
                                        ? "1px solid #d1d5db"
                                        : "none",
                                  }}
                                ></div>
                                <span>{record?.color?.name}</span>
                              </div>
                            ) : (
                              <Tag color="gold">Không có</Tag>
                            ),
                        },
                        {
                          key: "size",
                          dataIndex: "size",
                          align: "center",
                          title: "Kích thước",
                          render: (_, record) =>
                            record?.size && !isEmpty(record?.size) ? (
                              <span>{record?.size?.name}</span>
                            ) : (
                              <Tag color="purple">Không có</Tag>
                            ),
                        },
                      ]}
                      dataSource={
                        product?.variants && product?.variants?.length > 0
                          ? product?.variants?.map((item) => ({
                              key: item?._id,
                              ...item,
                            }))
                          : []
                      }
                      pagination={false}
                    />
                  ),
                },
              ]}
            />
          </div>
          <div>
            <Collapse
              items={[
                {
                  key: "variants",
                  label: "Các thuộc tính của sản phẩm",
                  children: (
                    <Table
                      size="small"
                      bordered
                      columns={[
                        {
                          key: "STT",
                          dataIndex: "STT",
                          title: "STT",
                          align: "center",
                          render: (_, __, index) => index + 1,
                        },
                        {
                          key: "name",
                          dataIndex: "name",
                          title: "Tên thuộc tính",
                          align: "center",
                        },
                        {
                          key: "value",
                          dataIndex: "value",
                          title: "Giá trị của thuộc tính",
                          align: "center",
                        },
                      ]}
                      dataSource={
                        product?.attributes && product?.attributes?.length > 0
                          ? product?.attributes?.map((item) => ({
                              key: item?._id,
                              ...item,
                            }))
                          : []
                      }
                      pagination={false}
                    />
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

export default ViewProductModal;
