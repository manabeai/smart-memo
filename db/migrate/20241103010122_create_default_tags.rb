class CreateDefaultTags < ActiveRecord::Migration[7.2]
  def change
    create_table :default_tags do |t|
      t.string :name
      t.timestamps
    end
  end
end
