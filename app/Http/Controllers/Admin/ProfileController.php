<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
     /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        if (!$request->user()->hasPermissionTo('access profile')){
            abort(403);
        }
        return Inertia::render('admin/profile/index');
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        if (!$request->user()->hasPermissionTo('access profile')){
            abort(403);
        }
        $request->user()->fill($request->validated());
        if ($request->has('avatar_action') && $request->avatar_action == 'delete'){
            $request->user()->clearMediaCollection('avatar');
        }
        if ($request->hasFile('avatar')) {
            $request->user()->clearMediaCollection('avatar');
            $request->user()
                ->addMedia($request->avatar)
                ->toMediaCollection('avatar');
        }

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();


        return redirect()->back()->with('success', 'Record updated');
    }
}
