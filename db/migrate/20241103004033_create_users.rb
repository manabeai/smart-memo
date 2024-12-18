class CreateUsers < ActiveRecord::Migration[7.2]
  def change
    create_table :users do |t|
      t.string :email
      t.string :password
      t.string :provider
      t.string :uid
      t.string :access_token
      t.string :access_secret
      t.boolean :guest
      t.timestamps
    end
    add_index :users, :email, unique: true
  end
end
