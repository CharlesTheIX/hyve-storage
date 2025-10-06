type Props = { size?: number };
const LoadingIcon: React.FC<Props> = (props: Props) => {
  const { size = 75 } = props;
  return (
    <div className="hyve-loading-icon">
      <div style={{ width: `${size}px`, height: `${size}px` }} />
    </div>
  );
};
export default LoadingIcon;
