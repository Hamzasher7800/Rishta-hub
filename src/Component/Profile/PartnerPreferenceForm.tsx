interface PartnerPreferenceFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function PartnerPreferenceForm({
  formData,
  setFormData,
}: PartnerPreferenceFormProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold mb-2">Partner Preferences (Optional)</h2>

      <input
        type="text"
        name="preferredAge"
        value={formData.preferredAge}
        onChange={handleChange}
        placeholder="Preferred Age Range"
        className="w-full border p-2 rounded-md"
      />

      <input
        type="text"
        name="preferredCity"
        value={formData.preferredCity}
        onChange={handleChange}
        placeholder="Preferred City"
        className="w-full border p-2 rounded-md"
      />

      <textarea
        name="otherDetails"
        value={formData.otherDetails}
        onChange={handleChange}
        placeholder="Other Preferences (optional)"
        className="w-full border p-2 rounded-md"
      />
    </div>
  );
}
