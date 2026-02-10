export const uploadFileToPinata = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error('File upload failed');
  return res.json(); // { IpfsHash }
};

export const uploadJSONToPinata = async (json) => {
  const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
    },
    body: JSON.stringify(json),
  });

  if (!res.ok) throw new Error('Metadata upload failed');
  return res.json(); // { IpfsHash }
};
