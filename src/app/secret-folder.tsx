// import { SecretFolderPage } from '@/pages/secret-folder';

// export default SecretFolderPage;

import { withAuthenticationRequired } from 'expo-with-pincode';

import { SecretFolderPage } from '@/pages/secret-folder';

function SecretFolderScreen() {
  return <SecretFolderPage />;
}

export default withAuthenticationRequired(SecretFolderScreen);
