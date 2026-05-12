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
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('name');
            $table->string('prefix')->nullable();
            $table->string('code')->unique();
            $table->string('tin')->nullable();
            $table->string('bin')->nullable();
            $table->text('address')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->enum('type', ['head office', 'Warehouse', 'Retail', 'Restaurant'])->default('Retail');
            $table->string('phone')->nullable();
            $table->string('pin_code')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('weekend')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_inventory_location')->default(true);
            $table->boolean('share_customer_details')->default(false);
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('stores')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
