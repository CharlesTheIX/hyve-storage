type Props = {
  size?: number;
  primaryColor?: string;
};

const Create: React.FC<Props> = (props: Props) => {
  const { size = 24, primaryColor = "inherit" } = props;

  return (
    <svg width={size} height={size} fill={primaryColor} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="none"
        strokeWidth={2}
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8"
      />
      <path
        strokeWidth={0.2}
        fill={primaryColor}
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 7h-4V3h-2v4h-4v2h4v4h2V9h4"
      />
    </svg>
  );
};

export default Create;
