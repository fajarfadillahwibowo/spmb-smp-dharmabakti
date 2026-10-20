<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class JadwalSeleksiMail extends Mailable
{
    use Queueable, SerializesModels;

    public $pendaftaran;
    public $seleksi;

    /**
     * Create a new message instance.
     */
    public function __construct($pendaftaran, $seleksi)
    {
        $this->pendaftaran = $pendaftaran;
        $this->seleksi = $seleksi;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Jadwal Tes Seleksi Masuk - SMP Dharma Bakti (' . $this->pendaftaran->nomor_pendaftaran . ')',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.jadwal_seleksi',
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
