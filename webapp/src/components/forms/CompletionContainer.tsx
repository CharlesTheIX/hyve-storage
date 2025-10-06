type Props = {
  title: string;
  message?: string;
};
const CompletionContainer: React.FC<Props> = (props: Props) => {
  const { title, message } = props;
  return (
    <div className="completion-container">
      <div>
        <h6>{title}</h6>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};
export default CompletionContainer;
