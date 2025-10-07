type Props = {
  size?: number;
  height?: number;
  primary_color?: string;
};

const Users: React.FC<Props> = (props: Props) => {
  const { size = 24, primary_color = "inherit" } = props;

  return (
    <svg fill={"none"} width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        strokeWidth={2}
        stroke={primary_color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 15C21.2091 15 23 16.7909 23 19V21H21M16 10.874C17.7252 10.4299 19 8.86384 19 7C19 5.13617 17.7252 3.57007 16 3.12602M5 15C2.79086 15 1 16.7909 1 19V21H17V19C17 16.7909 15.2091 15 13 15H9M9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11C11.2091 11 13 9.20914 13 7C13 6.27143 12.8052 5.58835 12.4649 5"
      />
    </svg>
  );
};

export default Users;
