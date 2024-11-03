class CreateMemoTags < ActiveRecord::Migration[7.2]
  def change
    create_table :memo_tags do |t|
      t.references :memo, null: false, foreign_key: true
      t.references :tag, null: false, foreign_key: true
      t.timestamps
    end
  end
end
