type Props = {
  size?: number;
  primary_color?: string;
  direction?: "left" | "right";
};

const PaginationEnd: React.FC<Props> = (props: Props) => {
  const { size = 24, primary_color = "inherit", direction = "left" } = props;

  switch (direction) {
    case "left":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20">
          <path
            fill={primary_color}
            d="M6 4a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1zm7.219.376a1 1 0 111.562 1.249L11.28 10l3.5 4.375a1 1 0 11-1.562 1.249l-4-5a1 1 0 010-1.25l4-5z"
          />
        </svg>
      );
    case "right":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20">
          <path
            fill={primary_color}
            d="M14 4a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1zm-7.219.376l4 5a1 1 0 010 1.249l-4 5a1 1 0 11-1.562-1.25l3.5-4.374-3.5-4.376a1 1 0 111.562-1.25z"
          />
        </svg>
      );
  }
};

export default PaginationEnd;
