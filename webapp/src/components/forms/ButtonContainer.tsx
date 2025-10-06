import Button from "@/components/buttons/Button";
type Props = {
  text: string;
  disabled?: boolean;
  callback: () => Promise<void>;
};
const ButtonContainer: React.FC<Props> = (props: Props) => {
  const { disabled, callback, text } = props;
  return (
    <div className="button-container">
      <Button
        type="submission"
        disabled={disabled}
        callback={async () => {
          if (disabled) return;
          await callback();
        }}
      >
        {text}
      </Button>
    </div>
  );
};
export default ButtonContainer;
