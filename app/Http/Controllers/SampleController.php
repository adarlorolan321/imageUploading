<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class SampleController extends Controller
{
    public function index()
    {
        return Inertia::render('image');
    }

    public function store(Request $request) 
    {

        $request->validate([
            'uploads.*.file' => 'required|file|mimes:jpeg,png,jpg,pdf|max:2048',
        ]);
    
        $images = $request->uploads;
        $ocrResponses = []; // Collect OCR responses
    
        foreach ($images as $imageData) {
            $file = $imageData; // Access the UploadedFile object
    
            // Convert the image to a base64 string
            $base64Image = $this->convertToBase64($file);
    
            // Make a request to the OCR API with the base64 image
            $ocrResponse = $this->sendToOcrApi($base64Image);
            
            // Collect the OCR response
            $ocrResponses[] = $ocrResponse;
        }

    
        // Redirect with flash data
        return response()->json(['ocrResponses' => $ocrResponses]);
    }
    

    private function convertToBase64($filePath)
    {
        $fileContent = file_get_contents($filePath); // Get the file content
        $base64Image = base64_encode($fileContent); // Convert to base64
        
        // Return a base64 image string in the format required by the OCR API
        return 'data:image/png;base64,' . $base64Image; // Adjust the mime type if necessary
    }

    private function sendToOcrApi($base64Image)
    {
        $url = "https://api.ocr.space/parse/image";
        $apiKey = "K89319220088957"; // Replace with your actual API key

        // Use cURL or Laravel's Http client to send the request
        $response = Http::asForm()->withHeaders([
            'apikey' => $apiKey,
        ])->post($url, [
            'base64Image' => $base64Image,
            'language' => 'eng',
            'isOverlayRequired' => 'false',
        ]);

        return $response->json(); // Return the OCR response as JSON
    }
}
