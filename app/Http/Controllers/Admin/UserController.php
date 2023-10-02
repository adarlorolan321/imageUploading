<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\StrHelper;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\User\UserListResource;
use App\Mail\UserWelcomeEmail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class UserController extends Controller
{
    use StrHelper;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, $role = null)
    {

        $page = $request->input('page', 1); // default 1
        $perPage = $request->input('perPage', 50); // default 50
        $queryString = str_replace(['%', '_'], ['\\%', '\\_'], $request->input('query', null));
        $sort = explode('.', $request->input('sort', 'first_name'));
        $order = $request->input('order', 'asc');

        $data = User::query()
            ->with([])
            ->where(function ($query) use ($queryString) {
                if ($queryString && $queryString != '') {
                    // filter result
                    $query->where('first_name', 'like', '%' . $queryString . '%')
                        ->orWhere('last_name', 'like', '%' . $queryString . '%');
                }
            })
            ->when(count($sort) == 1, function ($query) use ($sort, $order) {
                $query->orderBy($sort[0], $order);
            })
            ->paginate($perPage)
            ->withQueryString();

        $props = [
            'data' => UserListResource::collection($data),
            'params' => $request->all(),
        ];

        if ($request->wantsJson()) {
            return json_encode($props);
        }

        return Inertia::render('admin/User/Index', $props);
    }


    public function create()
    {
        return Inertia::render('admin/User/Create');
    }


    public function store(StoreUserRequest $request)
    {

        $password = $this->randomPassword();
        $data = User::create(array_merge($request->validated(), ['password' => bcrypt($password)]));
        $data->assignRole('Admin');

        Mail::to($data->email)->queue(new UserWelcomeEmail($data->first_name, $data->email, $password));

        if ($request->wantsJson()) {
            return new UserListResource($data);
        }
        return redirect()->route('admin.users.index')->with('message', 'Record Saved');
    }


    public function show(Request $request, string $id)
    {
        $data = User::findOrFail($id);
        if ($request->wantsJson()) {
            return new UserListResource($data);
        }
        return Inertia::render('admin/User/Show', [
            'data' => $data
        ]);
    }


    public function edit(Request $request, string $id)
    {
        $data = User::findOrFail($id);
        if ($request->wantsJson()) {
            return new UserListResource($data);
        }
        return Inertia::render('admin/User/Edit', [
            'data' => $data
        ]);
    }


    public function update(UpdateUserRequest $request, string $id)
    {
        
        $data = User::findOrFail($id);
        $userArr = $request->all();
        $data->update($userArr);

        if ($request->wantsJson()) {
            return (new UserListResource($data))
                ->response()
                ->setStatusCode(201);
        }
         return redirect()->back();
    }


    public function destroy(Request $request, string $id)
    {
        $data = User::findOrFail($id);
        $data->delete();
        sleep(1);

        if ($request->wantsJson()) {
            return response(null, 204);
        }
        return redirect()->route('admin.users.index')->with('success', 'Record Removed');
    }
}
