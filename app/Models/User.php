<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;


class User extends Authenticatable implements HasMedia
{
    use HasApiTokens, HasFactory, Notifiable;
    use HasRoles;
    use SoftDeletes;

    use InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

     protected $appends = ['full_name', 'avatar', 'small_name'];


     protected static function  booted()
    {
        static::deleting(function ($user) {
            $user->update([
                'email' => $user->email . '-deleted' . now()->format('Ymdhis')
            ]);
        });
    }

      /**
     * Get the fullname
     */
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $attributes['first_name'] ?? ''." ".$attributes['last_name'] ?? '',
        );
    }

    protected function smallName() : Attribute 
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => Str::upper($attributes['first_name'][0] . $attributes['last_name'][0]),
        );
    }
    /**
     * Get the fullname
     */
    protected function getAvatarAttribute()
    {
        return $this->getFirstMediaUrl('avatar');
    }
}
