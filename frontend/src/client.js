import { createThirdwebClient } from "thirdweb";

// Replace this with your client ID string

const clientId = "4ca601d5a90095c40c48eaf18697469d";

if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId: clientId,
});
