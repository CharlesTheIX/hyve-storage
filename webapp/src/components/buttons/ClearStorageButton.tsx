import Button from "./Button";
import Storage from "@/lib/classes/Storage";
import { useToastContext } from "@/contexts/toastContext";

const ClearStorageButton: React.FC = () => {
  const { setToastItems } = useToastContext();
  const callback = () => {
    Storage.clearAllStorage();
    setToastItems((prev) => {
      const new_item: ToastItem = { title: "Hyve Storage cache cleared", type: "success", content: "", timeout: 3000, visible: true };
      const new_items: ToastItem[] = [...prev, new_item];
      return new_items;
    });
  };
  return (
    <Button type="default" callback={callback}>
      Clear Cache
    </Button>
  );
};

export default ClearStorageButton;
