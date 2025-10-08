"use client";
import { useState } from "react";
import { colors } from "@/globals";
import Chevron from "@/components/svgs/Chevron";

type Props = {
  title: string;
  children: React.ReactNode;
};

const Accordion: React.FC<Props> = (props: Props) => {
  const { title, children } = props;
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className={`hyve-accordion ${open ? "open" : ""}`}>
      <div
        className="accordion-head"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <p>{title}</p>
        <Chevron size={24} primary_color={colors.green} direction="down" />
      </div>

      <div className="accordion-body">{children}</div>
    </div>
  );
};

export default Accordion;
