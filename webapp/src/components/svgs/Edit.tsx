type Props = {
  size?: number;
  primary_color?: string;
};

const Edit: React.FC<Props> = (props: Props) => {
  const { size = 24, primary_color = "inherit" } = props;

  return (
    <svg width={size} height={size} fill={primary_color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="none"
        strokeWidth={2}
        stroke={primary_color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8"
      />

      <polygon
        fill="none"
        strokeWidth={2}
        stroke={primary_color}
        strokeLinecap="round"
        strokeLinejoin="round"
        points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8"
      />
    </svg>
  );
};

export default Edit;
