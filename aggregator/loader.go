package main

import (
	"cmp"
	"encoding/json"
	"os"
	"path/filepath"
	"slices"
	"time"

	"github.com/go-playground/validator/v10"
)

func loadProblems(filePath string) ([]Problem, error) {
	f, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	var problems []Problem

	decoder := json.NewDecoder(f)
	err = decoder.Decode(&problems)
	if err != nil {
		return nil, err
	}

	validate := validator.New()
	err = validate.Var(problems, "")
	if err != nil {
		return nil, err
	}

	return problems, nil
}

func loadLists(dirPath string) ([]FullSource, error) {
	files, err := os.ReadDir(dirPath)
	if err != nil {
		return nil, err
	}

	var lists []FullSource

	for _, entry := range files {
		f, err := os.Open(filepath.Join(dirPath, entry.Name()))
		if err != nil {
			return nil, err
		}
		var l FullSource
		decoder := json.NewDecoder(f)
		decoder.DisallowUnknownFields()
		err = decoder.Decode(&l)
		if err != nil {
			return nil, err
		}
		lists = append(lists, l)
	}

	validate := validator.New()
	err = validate.Var(lists, "required")
	if err != nil {
		return nil, err
	}

	return lists, nil
}

func saveAggregate(aggregate LCAggregated, aggregatePath string) error {
	DifficultyToCmp := map[Difficulty]int{"Easy": 0, "Medium": 1, "Hard": 2}

	problemComp := func(p1, p2 AggregatedProblem) int {
		return cmp.Or(
			cmp.Compare(DifficultyToCmp[p1.Difficulty], DifficultyToCmp[p2.Difficulty]),
			cmp.Compare(p1.Id, p2.Id))
	}

	slices.SortFunc(aggregate.Problems, problemComp)

	file, _ := os.Create(aggregatePath)
	defer file.Close()
	encoder := json.NewEncoder(file)
	return encoder.Encode(aggregate)
}

func saveUpdateDates(lastCompaniesUpdate string, datePath string) error {
	dates := UpdateDates{
		time.Now().Format(time.DateOnly),
		lastCompaniesUpdate,
	}

	file, _ := os.Create(datePath)
	defer file.Close()
	encoder := json.NewEncoder(file)
	return encoder.Encode(dates)
}
