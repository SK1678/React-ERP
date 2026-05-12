<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('address')->nullable();
            $table->string('country')->nullable();
            $table->string('tin')->nullable();
            $table->string('bin')->nullable();
            $table->string('phone')->nullable();
            $table->boolean('is_active')->default(true);
            $table->longText('logo')->nullable();
            $table->string('owner_name')->nullable();
            $table->string('nid')->nullable();
            $table->longText('image')->nullable();
            $table->longText('photo')->nullable();
            $table->longText('trade_license')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
