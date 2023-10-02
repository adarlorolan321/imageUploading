<?php

namespace App\Http\Traits;

trait StrHelper {

    public function randomPassword(): string
    {

        $smallCase = 'abcdefghilkmnopqrstuvwxyz';
        $upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $numbers = '1234567890';
        $specialChar = '!@$%&*';

        $randomString = $upperCase[rand(0, strlen($upperCase) - 1)];

        for ($i=0; $i < 6; $i++) {
            $randomString .= $smallCase[rand(0, strlen($smallCase) - 1)];
        }

        $randomString .= $specialChar[rand(0, strlen($specialChar) - 1)];

        for ($i=0; $i < 2; $i++) {
            $randomString .= $numbers[rand(0, strlen($numbers) - 1)];
        }

        return str_shuffle($randomString);
    }

}