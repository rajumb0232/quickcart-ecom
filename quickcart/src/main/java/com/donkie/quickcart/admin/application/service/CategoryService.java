package com.donkie.quickcart.admin.application.service;

import com.donkie.quickcart.admin.application.model.CategoryCommand;
import com.donkie.quickcart.admin.application.model.CategoryResult;

import java.util.UUID;

public interface CategoryService {

    UUID createCategory(CategoryCommand.Create command);

    CategoryResult.Summary updateCategory(UUID categoryId, CategoryCommand.Update command);
}
