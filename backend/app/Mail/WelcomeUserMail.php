<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeUserMail extends Mailable
{
    use Queueable, SerializesModels;
    public $username;
    public $password;
    /**
     * Create a new message instance.
     */
   public function __construct($username, $password) {
    $this->username = $username;
    $this->password = $password;
}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome User Mail',
        );
    }

    /**
     * Get the message content definition.
     */
  public function content() {
    return new Content(
        view: 'emails.welcome', // On va créer cette vue
        with: ['username' => $this->username, 'password' => $this->password]
    );
}
    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
