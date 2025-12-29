"use client";

import { useState } from "react";

interface UserFormProps {
  user?: { name: string; email: string; role: string };
  onSubmit: (formData: { name: string; email: string; role: string }) => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState(user || { name: "", email: "", role: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Role:</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

const CreateEditUserPage = () => {
  const handleFormSubmit = (data: { name: string; email: string; role: string }) => {
    console.log("Form submitted:", data);
    // Add logic to save or update user
  };

  return (
    <div>
      <h1>Create/Edit User</h1>
      <UserForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default CreateEditUserPage;