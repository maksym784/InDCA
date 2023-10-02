export const copyToClipboard = async (text?: string): Promise<void> => {
  try {
    if (text) {
      return navigator.clipboard.writeText(text);
    }
  } catch (error) {
    throw new Error("Error while copying address");
  }
};
