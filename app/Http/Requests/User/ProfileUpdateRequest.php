<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function rules()
    {
        return [
            'first_name' => ['bail', 'required', 'string', 'max:255'],
            'last_name' => ['bail', 'required', 'string', 'max:255'],
            'email' => ['bail', 'required', 'email', 'string', 'max:255', Rule::unique('users')->where(fn ($query) => $query->whereNull('deleted_at'))->ignore(Auth::user())],
            'avatar' => ['nullable', 'file', 'max:2048', 'image'],
        ];
    }

    public function messages()
    {
        return [
            'avatar.file' => 'Invalid file',
            'avatar.max' => "File is too big",
            'avatar.image' => 'File type is invalid'
        ];
    }

    public function authorize()
    {
        return true;
    }

    protected function prepareForValidation()
    {
        if ($this->password == null) {
            $this->request->remove('password');
        }
    }
}
