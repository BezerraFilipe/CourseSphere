class User < ApplicationRecord
    has_secure_password
    
    validates :name, presence: true
    validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
    validates :auth_token, uniqueness: true
    
    before_create :generate_auth_token
    
    private
    
    def generate_auth_token
        self.auth_token = SecureRandom.hex(20)
    end
end
#name obrigatorio
#email obrigatorio e unico, formato de email valido
#password obrigatorio, com hash seguro (bcrypt)
#auth_token unico, gerado automaticamente para autenticação