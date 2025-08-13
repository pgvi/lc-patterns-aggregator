package main

import (
	"fmt"
	"slices"
	"strconv"
	"strings"

	"golang.org/x/exp/maps"
)

type Problem struct {
	Id         string   `json:"id" validate:"required"`
	Title      string   `json:"title" validate:"required"`
	Difficulty string   `json:"difficulty" validate:"oneof=Easy Medium Hard"`
	Premium    bool     `json:"premium"`
	URL        string   `json:"url" validate:"url"`
	Topics     []string `json:"topics"`
}

type AggregatedProblem struct {
	Id         int64      `json:"id"`
	Title      string     `json:"title"`
	Difficulty Difficulty `json:"difficulty"`
	Premium    bool       `json:"premium"`
	URL        string     `json:"url"`
	Topics     []string   `json:"topics"`
	Sources    []string   `json:"lists"`
	Companies  []Company  `json:"companies"`
}

type Difficulty string

const (
	Easy   Difficulty = "easy"
	Medium Difficulty = "medium"
	Hard   Difficulty = "hard"
)

type Source struct {
	Id    string `json:"id" validate:"required"`
	Title string `json:"title" validate:"required"`
	URL   string `json:"url" validate:"url"`
}

type FullSource struct {
	Source
	Problems []string `json:"problems" validate:"required,dive,required"`
}

type ProblemsTopics struct {
	Problems []AggregatedProblem `json:"problems"`
	Topics   []string            `json:"topics"`
}

type LCAggregated struct {
	Sources   []Source            `json:"sources"`
	Companies []string            `json:"companies"`
	Problems  []AggregatedProblem `json:"problems"`
	Topics    []string            `json:"topics"`
}

type UpdateDates struct {
	LastUpdate          string `json:"lastUpdate"`
	LastCompaniesUpdate string `json:"lastCompaniesUpdate"`
}

func AggregateProblemsAndSources(problems []Problem, fullSources []FullSource) (*LCAggregated, error) {
	aggregate := LCAggregated{[]Source{}, []string{}, []AggregatedProblem{}, []string{}}

	idToProblem := mapIdToProblem(problems)

	parsed, err := parseLists(idToProblem, fullSources)
	if err != nil {
		return nil, fmt.Errorf("failed to parse problems %s\n", err)
	}

	aggregate.Problems = parsed.Problems
	aggregate.Topics = parsed.Topics

	for _, f := range fullSources {
		s := Source{f.Id, f.Title, f.URL}
		aggregate.Sources = append(aggregate.Sources, s)
	}

	return &aggregate, nil
}

// mapIdToProblem maps from leetcode frontend id to full problem info after
// by reading the file provided in problemsPath
func mapIdToProblem(problems []Problem) map[string]Problem {
	idToProblem := make(map[string]Problem)

	for _, p := range problems {
		idToProblem[p.Id] = p
	}
	return idToProblem
}

func parseLists(idToProblem map[string]Problem, fullLists []FullSource) (*ProblemsTopics, error) {
	idToParsed := make(map[string]AggregatedProblem)
	uniqueTopics := map[string]bool{}

	for _, list := range fullLists {
		for _, pId := range list.Problems {
			parsed, present := idToParsed[pId]
			if !present {
				p, ok := idToProblem[pId]
				if !ok {
					return nil, fmt.Errorf("Problem not found")
				}

				var problemTopics []string
				for _, t := range p.Topics {
					s := strings.ToLower(t)
					problemTopics = append(problemTopics, s)
					uniqueTopics[s] = true
				}

				id, err := strconv.ParseInt(pId, 10, 64)
				if err != nil {
					return nil, fmt.Errorf("Unable do parse problem id: %s", pId)
				}

				parsed = AggregatedProblem{
					id,
					p.Title,
					Difficulty(p.Difficulty),
					p.Premium,
					p.URL,
					problemTopics,
					[]string{},
					[]Company{},
				}
			}
			parsed.Sources = append(parsed.Sources, list.Id)
			idToParsed[pId] = parsed
		}
	}

	problems := maps.Values(idToParsed)

	allTopics := []string{}
	for k := range uniqueTopics {
		allTopics = append(allTopics, k)
	}
	slices.Sort(allTopics)

	return &ProblemsTopics{problems, allTopics}, nil
}
