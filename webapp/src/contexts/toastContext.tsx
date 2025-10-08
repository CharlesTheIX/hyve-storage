"use client";
import CrossSVG from "@/components/svgs/Cross";
import { createContext, useContext, useState, useEffect, useRef } from "react";

type ToastContextData = {
  toastItems: ToastItem[];
  setToastItems: React.Dispatch<React.SetStateAction<ToastItem[]>>;
};

const default_value: ToastContextData = {
  toastItems: [],
  setToastItems: () => {},
};

const ToastContext = createContext<ToastContextData>(default_value);

export const ToastContextProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const timeout_count = 500;
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
        const new_items = prev.filter((i) => {
          if (i.timeout <= 0 || !i.visible) return;
          i.timeout -= timeout_count;
          return i;
        });
        return new_items;
      });
    }, timeout_count);

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [toastItems]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {toastItems.length > 0 && (
        <div className="hyve-toast-container" style={{ translate: `0 ${-400 - toastItems.length * 300}%` }}>
          {toastItems.reverse().map((i: ToastItem, key: number) => {
            if (!i.visible) return <></>;
            return (
              <div key={key} className={`hyve-toast ${i.type}`}>
                <div
                  className="close-container"
                  onClick={() => {
                    i.visible = false;
                  }}
                >
                  <CrossSVG size={16} />
                </div>

                <h6>{i.title}</h6>
                <p>{i.content}</p>
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
