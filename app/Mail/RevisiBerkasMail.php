<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RevisiBerkasMail extends Mailable
{
    use Queueable, SerializesModels;

    public $pendaftaran;
    public $catatanVerifikasi;

    /**
     * Create a new message instance.
     */
    public function __construct($pendaftaran, $catatanVerifikasi)
    {
        $this->pendaftaran = $pendaftaran;
        $this->catatanVerifikasi = $catatanVerifikasi;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Pemberitahuan Revisi Berkas Pendaftaran - SMP Dharma Bakti (' . $this->pendaftaran->nomor_pendaftaran . ')',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.revisi_berkas',
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
