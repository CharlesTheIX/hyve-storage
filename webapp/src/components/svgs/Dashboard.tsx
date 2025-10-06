type Props = {
  size?: number;
  primaryColor?: string;
};

const Dashboard: React.FC<Props> = (props: Props) => {
  const { size = 24, primaryColor = "inherit" } = props;

  return (
    <svg fill={"none"} width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g stroke={primaryColor} strokeWidth={1} fill={"none"} fillRule="evenodd">
        <rect x={4} y={4} rx={2} width={16} height={16} strokeWidth={2} stroke={primaryColor} strokeLinecap="round" />
        <line x1={4} y1={9} x2={20} y2={9} stroke={primaryColor} strokeWidth={2} strokeLinecap="round" />
        <line x1={9} x2={9} y1={10} y2={20} strokeWidth={2} stroke={primaryColor} strokeLinecap="round" />
      </g>
    </svg>
  );
};

export default Dashboard;
