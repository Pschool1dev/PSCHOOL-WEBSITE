<?php

return [
    'accepted'        => 'Le champ :attribute doit être accepté.',
    'email'           => 'Le champ :attribute doit être une adresse e-mail valide.',
    'exists'          => 'Le champ :attribute sélectionné est invalide.',
    'min'             => [
        'numeric' => 'Le champ :attribute doit être au moins :min.',
        'string'  => 'Le champ :attribute doit contenir au moins :min caractères.',
    ],
    'required'        => 'Le champ :attribute est obligatoire.',
    'unique'          => 'La valeur du champ :attribute est déjà utilisée.',
    'confirmed'       => 'La confirmation du champ :attribute ne correspond pas.',
    'in'              => 'Le champ :attribute est invalide.',

    /*
    |--------------------------------------------------------------------------
    | Noms des attributs personnalisés
    |--------------------------------------------------------------------------
    | Ici, on remplace "password" par "mot de passe" dans les messages.
    */
    'attributes' => [
        'email'    => 'adresse e-mail',
        'password' => 'mot de passe',
        'nom'      => 'nom complet',
        'telephone'=> 'numéro de téléphone',
    ],
];