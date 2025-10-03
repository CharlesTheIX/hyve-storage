  type Props = {
    err?: any;
    message: string;
    callback?: () => void;
  };

  export default (props: Props) => {
    const { err, message, callback = () => {}} = props;
    console.error(message);
    if (err) console.error(err);
    callback();
  };