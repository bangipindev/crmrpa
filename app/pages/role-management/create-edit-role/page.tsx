"use client";

import React, { useState } from "react";
import Link from "next/link";

interface RoleFormProps {
  role?: { name: string; description: string };
  onSubmit: (formData: { name: string; description: string }) => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ role, onSubmit }) => {
  const [formData, setFormData] = useState(role || { name: "", description: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

const CreateEditRolePage = () => {
  const handleFormSubmit = (data: { name: string; description: string }) => {
    console.log("Form submitted:", data);
    // Add logic to save or update role
  };

  return (
    <div>
      <nav>
        <Link href="/user-management">User List</Link>
        <Link href="/role-management">Role List</Link>
      </nav>
      <h1>Create/Edit Role</h1>
      <RoleForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default CreateEditRolePage;