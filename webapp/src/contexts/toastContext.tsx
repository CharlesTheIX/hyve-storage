"use client";
import CrossSVG from "@/components/svgs/Cross";
import { createContext, useContext, useState, useEffect, useRef } from "react";

type ToastContextData = {
  toastItems: ToastItem[];
  setToastItems: React.Dispatch<React.SetStateAction<ToastItem[]>>;
};
export type ToastItem = {
  title: string;
  type: ToastType;
  content: string;
  timeout: number;
  visible: boolean;
};
type ToastType = "success" | "error";

const defaultValue: ToastContextData = {
  toastItems: [],
  setToastItems: () => {},
};

const ToastContext = createContext<ToastContextData>(defaultValue);

export const ToastContextProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const timeoutCount = 500;
  const interval = useRef<NodeJS.Timeout>(null);
  const [toastItems, setToastItems] = useState<ToastItem[]>([]);
  const value: ToastContextData = {
    toastItems,
    setToastItems,
  };

  useEffect(() => {
    interval.current = setInterval(() => {
      if (toastItems.length === 0) return;
      setToastItems((prev) => {
        const newItems = prev.filter((item) => {
          if (item.timeout <= 0 || !item.visible) return;
          item.timeout -= timeoutCount;
          return item;
        });
        return newItems;
      });
    }, timeoutCount);

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [toastItems]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {toastItems.length > 0 && (
        <div className="hyve-toast-container">
          {toastItems.reverse().map((item: ToastItem, key: number) => {
            if (!item.visible) return <></>;
            return (
              <div key={key} className={`hyve-toast ${item.type}`}>
                <div
                  className="close-container"
                  onClick={() => {
                    item.visible = false;
                  }}
                >
                  <CrossSVG primaryColor="#222629" width={16} height={16} />
                </div>

                <h6>{item.title}</h6>
                <p>{item.content}</p>
              </div>
            );
          })}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToastContext must be used within a ToastContextProvider.");
  return context;
};
