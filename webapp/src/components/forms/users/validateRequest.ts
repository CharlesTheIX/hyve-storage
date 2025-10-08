import getInputError from "@/lib/getInputError";

export default (data: Partial<User>): { invalid_inputs: { [key: string]: boolean }; simple_error: SimpleError } => {
  var invalid;
  const inputs_invalid: { [key: string]: boolean } = {};
  var message = "Please address the following errors:\n";

  Object.keys(data).map((key: string) => {
    switch (key) {
      case "_id":
        invalid = getInputError("mongo_id", data[key], true);
        if (invalid.error) {
          inputs_invalid.user_id = invalid.error;
          message += `- User: ${invalid.message}\n`;
        }
        break;

      case "username":
        invalid = getInputError("username", data[key], true);
        if (invalid.error) {
          inputs_invalid.username = invalid.error;
          message += `- Username: ${invalid.message}\n`;
        }
        break;

      case "surname":
        invalid = getInputError("name", data[key], true);
        if (invalid.error) {
          inputs_invalid.surname = invalid.error;
          message += `- Surname: ${invalid.message}\n`;
        }
        break;

      case "first_name":
        invalid = getInputError("name", data[key], true);
        if (invalid.error) {
          inputs_invalid.first_name = invalid.error;
          message += `- First name: ${invalid.message}\n`;
        }
        break;

      case "permissions":
        var err: boolean = data[key]?.length === 0;
        if (err) {
          inputs_invalid.permissions = true;
          message += `- Permissions: At least one value is required.\n`;
        }

        data[key]?.forEach((p) => {
          if (err) return;
          invalid = getInputError("number", p, true);
          if (invalid.error) {
            inputs_invalid.permissions = invalid.error;
            message += `- Permissions: ${invalid.message}\n`;
          }
        });
        break;

      case "company_id":
        invalid = getInputError("mongo_id", data[key], false);
        if (invalid.error) {
          inputs_invalid.company_id = invalid.error;
          message += `- Company: ${invalid.message}\n`;
        }
        break;
    }
  });

  const title = "Input error";
  const error = Object.keys(inputs_invalid).length > 0;
  if (!error) message = "";
  // setInputErrors(inputs_invalid);
  return { invalid_inputs: inputs_invalid, simple_error: { error, message, title } };
};
