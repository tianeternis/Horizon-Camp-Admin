import { ORDER_STATUS } from "@/utils/order";

const StatusTag = ({ status = ORDER_STATUS.PENDING }) => {
  return (
    <>
      {status === ORDER_STATUS.PENDING && (
        <div className="rounded border-2 border-solid border-yellow-100 bg-yellow-50 px-6 py-2 text-sm font-medium text-yellow-500">
          {status}
        </div>
      )}

      {status === ORDER_STATUS.PREPARING && (
        <div className="rounded border-2 border-solid border-blue-100 bg-blue-50 px-6 py-2 text-sm font-medium text-blue-500">
          {status}
        </div>
      )}

      {status === ORDER_STATUS.DELIVERING && (
        <div className="rounded border-2 border-solid border-orange-100 bg-orange-50 px-6 py-2 text-sm font-medium text-orange-500">
          {status}
        </div>
      )}

      {status === ORDER_STATUS.COMPLETED && (
        <div className="rounded border-2 border-solid border-green-100 bg-green-50 px-6 py-2 text-sm font-medium text-green-500">
          {status}
        </div>
      )}

      {status === ORDER_STATUS.CANCELED && (
        <div className="rounded border-2 border-solid border-red-100 bg-red-50 px-6 py-2 text-sm font-medium text-red-500">
          {status}
        </div>
      )}
    </>
  );
};

export default StatusTag;
