import Button from "./Button";
import Storage from "@/lib/classes/Storage";
import { ToastItem, useToastContext } from "@/contexts/toastContext";
const ClearStorageButton: React.FC = () => {
  const { setToastItems } = useToastContext();
  const callback = () => {
    Storage.clearAllStorage();
    setToastItems((prevValue) => {
      const newItem: ToastItem = { title: "Hyve Storage cache cleared", type: "success", content: "", timeout: 3000, visible: true };
      const newItems: ToastItem[] = [...prevValue, newItem];
      return newItems;
    });
  };
  return (
    <Button type="default" callback={callback}>
      Clear Cache
    </Button>
  );
};

export default ClearStorageButton;
